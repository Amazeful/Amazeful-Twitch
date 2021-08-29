//Enum roles defines flags for user roles
export enum Roles {
  GLOBAL = 1 << 0,
  SUBSCRIBER = 1 << 1,
  VIP = 1 << 2,
  REGUALR = 1 << 3,
  EDITOR = 1 << 4,
  MODERATOR = 1 << 5,
  SUPERMOD = 1 << 6,
  BROADCASTER = 1 << 7,
  ADMIN = 1 << 8
}
