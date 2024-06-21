export enum Status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked',
}

export enum ReportType {
  USER = 'user',
  POST = 'post',
  COMMENT = 'comment',
  IMAGE = 'image',
}

export enum ReportStatus {
  PENDING = 'pending', // Pendiente
  RESOLVED = 'resolved', // Resuelto
  REJECTED = 'rejected', // Rechazado
}
