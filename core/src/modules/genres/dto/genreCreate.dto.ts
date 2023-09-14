import { IsString } from "class-validator";


export class GenreCreateDto {

    @IsString()
    name: string


}