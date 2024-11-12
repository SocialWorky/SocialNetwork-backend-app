import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum CustomFieldType {
  TEXT = 'text',
  LIST = 'list',
  TEXTAREA = 'textarea',
  OPTION = 'option',
  DATE = 'date',
  IMAGE = 'image',
  SELECT = 'select',
}

export enum CustomFieldDestination {
  PROFILE = 'profile',
  REGISTRATION = 'register',
}

export interface FieldOptions {
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  visible?: boolean;
}

export interface TextOptions extends FieldOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  email?: boolean;
  mask?: string;
}

export interface SelectOptions extends FieldOptions {
  choices?: { value: string; label: string }[];
  multiple?: boolean;
}

export interface NumberOptions extends FieldOptions {
  min?: number;
  max?: number;
  step?: number;
}

export interface TextAreaOptions extends FieldOptions {
  rows?: number;
  cols?: number;
}

@Entity()
export class CustomField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  index: number;

  @Column()
  idName: string;

  @Column({ type: 'enum', enum: CustomFieldType })
  type: CustomFieldType;

  @Column()
  label: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  options: FieldOptions | TextOptions | SelectOptions | NumberOptions | TextAreaOptions;

  @Column({ type: 'enum', enum: CustomFieldDestination })
  destination: CustomFieldDestination;
}
