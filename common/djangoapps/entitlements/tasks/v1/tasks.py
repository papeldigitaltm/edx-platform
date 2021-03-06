"""
This file contains celery tasks for entitlements-related functionality.
"""

from celery import task
from celery.utils.log import get_task_logger
from django.conf import settings


LOGGER = get_task_logger(__name__)
# Under cms the following setting is not defined, leading to errors during tests.
ROUTING_KEY = getattr(settings, 'ENTITLEMENTS_EXPIRATION_ROUTING_KEY', None)
# Maximum number of retries before giving up on awarding credentials.
# For reference, 11 retries with exponential backoff yields a maximum waiting
# time of 2047 seconds (about 30 minutes). Setting this to None could yield
# unwanted behavior: infinite retries.
MAX_RETRIES = 11


@task(bind=True, ignore_result=True, routing_key=ROUTING_KEY)
def expire_old_entitlements(self, entitlements, logid='...'):
    """
    This task is designed to be called to process a bundle of entitlements
    that might be expired and confirm if we can do so. This is useful when
    checking if an entitlement has just been abandoned by the learner and needs
    to be expired. (In the normal course of a learner using the platform, the
    entitlement will expire itself. But if a learner doesn't log in... So we
    run this task every now and then to clear the backlog.)

    Args:
        entitlements (list): An iterable set of CourseEntitlements to check
        logid (str): A string to identify this task in the logs

    Returns:
        None

    """
    LOGGER.info('Running task expire_old_entitlements [%s]', logid)

    countdown = 2 ** self.request.retries

    try:
        for entitlement in entitlements:
            # This property request will update the expiration if necessary as
            # a side effect. We could manually call update_expired_at(), but
            # let's use the same API the rest of the LMS does, to mimic normal
            # usage and allow the update call to be an internal detail.
            if entitlement.expired_at_datetime:
                LOGGER.info('Expired entitlement with id %d [%s]', entitlement.id, logid)

    except Exception as exc:
        LOGGER.exception('Failed to expire entitlements [%s]', logid)
        # The call above is idempotent, so retry at will
        raise self.retry(exc=exc, countdown=countdown, max_retries=MAX_RETRIES)

    LOGGER.info('Successfully completed the task expire_old_entitlements [%s]', logid)
