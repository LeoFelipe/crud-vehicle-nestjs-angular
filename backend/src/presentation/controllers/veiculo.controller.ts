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
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateVeiculoUseCase } from '../../application/use-cases/veiculos/create-veiculo.use-case';
import { UpdateVeiculoUseCase } from '../../application/use-cases/veiculos/update-veiculo.use-case';
import { DeleteVeiculoUseCase } from '../../application/use-cases/veiculos/delete-veiculo.use-case';
import { GetVeiculosUseCase } from '../../application/use-cases/veiculos/get-veiculos.use-case';
import { GetVeiculoByIdUseCase } from '../../application/use-cases/veiculos/get-veiculo-by-id.use-case';
import { VeiculoResponseDto } from '../responses/veiculo-response.dto';
import { CreateVeiculoRequestDto } from '../requests/create-veiculo-request.dto';
import { UpdateVeiculoRequestDto } from '../requests/update-veiculo-request.dto';

@ApiTags('Veículos')
@Controller('veiculos')
@UsePipes(new ValidationPipe({ transform: true }))
export class VeiculoController {
  constructor(
    private readonly createVeiculoUseCase: CreateVeiculoUseCase,
    private readonly updateVeiculoUseCase: UpdateVeiculoUseCase,
    private readonly deleteVeiculoUseCase: DeleteVeiculoUseCase,
    private readonly getVeiculosUseCase: GetVeiculosUseCase,
    private readonly getVeiculoByIdUseCase: GetVeiculoByIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo veículo' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateVeiculoRequestDto,
  ): Promise<VeiculoResponseDto> {
    return this.createVeiculoUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os veículos' })
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<VeiculoResponseDto[]> {
    return this.getVeiculosUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar veículo por ID' })
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<VeiculoResponseDto> {
    return this.getVeiculoByIdUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar veículo' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVeiculoRequestDto,
  ): Promise<VeiculoResponseDto> {
    return this.updateVeiculoUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar veículo' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteVeiculoUseCase.execute(id);
  }
}
