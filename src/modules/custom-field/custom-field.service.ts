import { Injectable } from '@nestjs/common';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { CustomField, CustomFieldDestination, CustomFieldType } from './entities/custom-field.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class CustomFieldService {

  constructor(
    @InjectRepository(CustomField)
    private readonly customFieldRepository: Repository<CustomField>,
  ) {}
  create(createCustomFieldDto: CreateCustomFieldDto) {
    const { index, idName, label, isActive, type, options, destination } = createCustomFieldDto;
    const customField = new CustomField();

    customField.index = index;
    customField.idName = idName;
    customField.label = label;
    customField.isActive = isActive;
    customField.type = type as CustomFieldType;
    customField.options = options;
    customField.destination = destination as CustomFieldDestination;

    return this.customFieldRepository.save(customField);
    
  }

  findAll() {
    return this.customFieldRepository.find({
      order: {
        index: 'ASC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} customField`;
  }

  update(id: string, updateCustomFieldDto: UpdateCustomFieldDto) {
    const { index, idName, label, isActive, type, options, destination } = updateCustomFieldDto;
    const customField = new CustomField();

    customField.id = id;
    customField.index = index;
    customField.idName = idName;
    customField.label = label;
    customField.isActive = isActive;
    customField.type = type as CustomFieldType;
    customField.options = options;
    customField.destination = destination as CustomFieldDestination;

    return this.customFieldRepository.save(customField);
  }

  remove(id: string) {
    return this.customFieldRepository.delete(id);    
  }
}
