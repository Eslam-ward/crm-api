import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { buildQueryDto } from 'src/common/dto/base-query.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { UpdateClientDto } from './dto/update-client.dto';
import { UserRole } from 'src/users/enums/roles.enum';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')

@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SALES)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create client' })
  create(@Body() CreateClientDto: CreateClientDto) {
    return this.clientService.create(CreateClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  findAll(@Query() query: buildQueryDto) {
    return this.clientService.findAll(query);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Clients dashboard analytics' })
  getDashboard() {
    return this.clientService.getDashboardStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client details' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.clientService.findOne(id);
  }
  // @desc update client details
  // @route PATCH /api/clients/:id
  // @access Private
  @Patch(':id')
  @ApiOperation({ summary: 'Update client details' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDto: UpdateClientDto,
  ) {
    return this.clientService.update(id, updateDto);
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get client analytics' })
  getAnalytics(@Param('id') id: string) {
    return this.clientService.getClientAnalytics(id);
  }
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
