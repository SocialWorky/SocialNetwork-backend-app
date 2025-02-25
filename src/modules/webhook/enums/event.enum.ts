export enum EventEnum {
  // User events
  USER_REGISTERED = 'user_registered',
  USER_LOGIN = 'user_login',
  USER_EDITED = 'user_edited',
  USER_DELETED = 'user_deleted',
  USER_EMAIL_VERIFIED = 'user_email_verified',
  USER_PASSWORD_RESET = 'user_password_reset',
  // Publication events
  PUBLICATION_CREATED = 'publication_created',
  PUBLICATION_EDITED = 'publication_edited',
  PUBLICATION_DELETED = 'publication_deleted',
  PUBLICATION_LIKED = 'publication_liked',
  PUBLICATION_UNLIKED = 'publication_unliked',
  PUBLICATION_COMMENTED = 'publication_commented',
  PUBLICATION_COMMENT_DELETED = 'publication_comment_deleted',
  PUBLICATION_COMMENT_LIKED = 'publication_comment_liked',
  PUBLICATION_COMMENT_UNLIKED = 'publication_comment_unliked',
}
