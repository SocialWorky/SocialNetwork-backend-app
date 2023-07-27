export class CreateTagDto {
  _id: string;

  name: string;

  taggedUsers: string[];
}

export class UpdateTagDto {
  name: string;

  taggedUsers: string[];
}
