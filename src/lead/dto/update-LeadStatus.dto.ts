import {
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { LeadStatus } from '../enums/LeadStatus.enum';


export class UpdateLeadStatusDto {
    @IsNotEmpty()
    @IsEnum(LeadStatus)
    status: LeadStatus;

}
