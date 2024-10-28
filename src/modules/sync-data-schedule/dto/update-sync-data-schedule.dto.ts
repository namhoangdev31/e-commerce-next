import { PartialType } from '@nestjs/mapped-types';
import { CreateSyncDataScheduleDto } from './create-sync-data-schedule.dto';

export class UpdateSyncDataScheduleDto extends PartialType(CreateSyncDataScheduleDto) {}
