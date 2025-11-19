import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateCommitReviewDto {
  @IsString()
  @IsNotEmpty()
  public sha: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public reviewBy?: string;

  @IsString()
  @IsNotEmpty()
  public reviewer: string;

  @IsString()
  @IsNotEmpty()
  public message: string;

  @IsString()
  @IsNotEmpty()
  public suggested: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  public adherence?: number;

  @IsString()
  @IsOptional()
  public adherence_comment?: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  public vulnerability?: number;

  @IsString()
  @IsOptional()
  public vulnerability_comment?: string;

  @IsString()
  @IsOptional()
  public complexity_comment?: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  public singleResponsibility?: number;

  @IsString()
  @IsOptional()
  public singleResponsibility_comment?: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  public openClosed?: number;

  @IsString()
  @IsOptional()
  public openClosed_comment?: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  public liskovSubstitution?: number;

  @IsString()
  @IsOptional()
  public liskovSubstitution_comment?: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  public interfaceSegregation?: number;

  @IsString()
  @IsOptional()
  public interfaceSegregation_comment?: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  public dependencyInversion?: number;

  @IsString()
  @IsOptional()
  public dependencyInversion_comment?: string;
}
