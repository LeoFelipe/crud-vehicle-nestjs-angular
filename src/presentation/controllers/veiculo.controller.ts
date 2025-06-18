import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { CreateVeiculoUseCase } from '../../application/use-cases/veiculos/create-veiculo.use-case';
import { UpdateVeiculoUseCase } from '../../application/use-cases/veiculos/update-veiculo.use-case';
import { DeleteVeiculoUseCase } from '../../application/use-cases/veiculos/delete-veiculo.use-case';
import { GetVeiculosUseCase } from '../../application/use-cases/veiculos/get-veiculos.use-case';
import { GetVeiculoByIdUseCase } from '../../application/use-cases/veiculos/get-veiculo-by-id.use-case';
import { CreateVeiculoDto } from '../../application/dto/create-veiculo.dto';
import { UpdateVeiculoDto } from '../../application/dto/update-veiculo.dto';
import { VeiculoResponseDto } from '../../application/dto/veiculo-response.dto';

@Controller('veiculos')
@UsePipes(new ValidationPipe({ transform: true }))
export class VeiculoController {
  constructor(
    private readonly createVeiculoUseCase: CreateVeiculoUseCase,
    private readonly updateVeiculoUseCase: UpdateVeiculoUseCase,
    private readonly deleteVeiculoUseCase: DeleteVeiculoUseCase,
    private readonly getVeiculosUseCase: GetVeiculosUseCase,
    private readonly getVeiculoByIdUseCase: GetVeiculoByIdUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateVeiculoDto): Promise<VeiculoResponseDto> {
    return this.createVeiculoUseCase.execute(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<VeiculoResponseDto[]> {
    return this.getVeiculosUseCase.execute();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<VeiculoResponseDto> {
    return this.getVeiculoByIdUseCase.execute(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVeiculoDto
  ): Promise<VeiculoResponseDto> {
    return this.updateVeiculoUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteVeiculoUseCase.execute(id);
  }
} 