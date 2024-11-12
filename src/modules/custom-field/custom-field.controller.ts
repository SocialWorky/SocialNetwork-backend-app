import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CustomFieldService } from './custom-field.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Role } from 'src/common/enums/rol.enum';

@Controller('custom-fields')
export class CustomFieldController {
  constructor(private readonly customFieldService: CustomFieldService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  create(@Body() createCustomFieldDto: CreateCustomFieldDto) {
    return this.customFieldService.create(createCustomFieldDto);
  }

  @Get()
  findAll() {
    return this.customFieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customFieldService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateCustomFieldDto: UpdateCustomFieldDto) {
    return this.customFieldService.update(id, updateCustomFieldDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.customFieldService.remove(id);
  }
}
