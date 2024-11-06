import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"
import { IsString } from "class-validator"

export class UserRoleDto {
  @ApiProperty({
    description: 'Code of the user to assign role to',
    example: '67287228e9647d06a5097ff6',
  })
  @IsNotEmpty()
  @IsString()
  userCode: string

  @ApiProperty({
    description: 'Code of the role to assign to user',
    example: '6728881a420a057677044177',
  })
  @IsNotEmpty()
  @IsString()
  roleCode: string
}
