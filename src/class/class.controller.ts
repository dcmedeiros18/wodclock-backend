import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('test')
  test() {
    return { message: 'Class controller is working', timestamp: new Date() };
  }

  @Get('auth-test')
  @UseGuards(AuthGuard('jwt'))
  authTest(@Request() req) {
    return { 
      message: 'Autenticação funcionando!', 
      user: req.user,
      timestamp: new Date() 
    };
  }

  @Get('auth-debug')
  authDebug(@Request() req) {
    return { 
      message: 'Debug de autenticação',
      headers: req.headers,
      authorization: req.headers.authorization,
      timestamp: new Date() 
    };
  }

  @Get('debug')
  async debug() {
    try {
      const allClasses = await this.classService.findAll();
      return {
        message: 'Debug endpoint',
        totalClasses: allClasses.length,
        classes: allClasses,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Debug error:', error);
      throw new HttpException('Erro no debug', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('public/:date')
  async findByDatePublic(@Param('date') date: string) {
    try {
      // Validação segura do formato da data (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new HttpException('Invalid date format. Use YYYY-MM-DD', HttpStatus.BAD_REQUEST);
      }
  
      const classes = await this.classService.findByDate(date);
      return {
        message: 'Endpoint público (sem autenticação)',
        date,
        totalClasses: classes.length,
        classes,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in findByDatePublic:', error);
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('raw/:date')
  async findByDateRaw(@Param('date') date: string) {
    try {
      // Validar formato da data (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new HttpException('Invalid date format. Use YYYY-MM-DD', HttpStatus.BAD_REQUEST);
      }
  
      // Consulta direta sem processamento para debug
      const rawClasses = await this.classService.findAll();
      const targetDate = date;
  
      const classesForDate = rawClasses.filter(cls => {
        return cls.date === targetDate;
      });
  
      return {
        message: 'Debug - dados brutos do banco',
        date,
        targetDate,
        totalClassesInDB: rawClasses.length,
        classesForThisDate: classesForDate.length,
        classes: classesForDate.map(cls => ({
          id: cls.id,
          date: cls.date,
          time: cls.time,
          maxspots: cls.maxspots,
          status: cls.status,
          wod_id: cls.wod_id
        })),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in findByDateRaw:', error);
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('by-date')
  @UseGuards(AuthGuard('jwt'))
  async findByDate(@Query('date') date: string, @Request() req) {
    try {
      if (!date) {
        throw new HttpException('Data é obrigatória', HttpStatus.BAD_REQUEST);
      }
      
      // Validar formato da data
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new HttpException('Data inválida', HttpStatus.BAD_REQUEST);
      }

      // Validar se o usuário está autenticado
      if (!req.user || !req.user.id) {
        throw new HttpException('Usuário não autenticado', HttpStatus.UNAUTHORIZED);
      }
      
      return await this.classService.findByDate(date, req.user.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error in findByDate:', error);
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('date/:date')
  @UseGuards(AuthGuard('jwt'))
  async findByDatePath(@Param('date') date: string, @Request() req) {
    try {
      if (!date) {
        throw new HttpException('Data é obrigatória', HttpStatus.BAD_REQUEST);
      }
      
      // Validar formato da data - aceitar formato YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new HttpException('Data inválida. Use o formato YYYY-MM-DD', HttpStatus.BAD_REQUEST);
      }
      
      const dateObj = new Date(date + 'T00:00:00');
      if (isNaN(dateObj.getTime())) {
        throw new HttpException('Data inválida', HttpStatus.BAD_REQUEST);
      }

      // Validar se o usuário está autenticado
      if (!req.user || !req.user.id) {
        throw new HttpException('Usuário não autenticado', HttpStatus.UNAUTHORIZED);
      }
      
      return await this.classService.findByDate(date, req.user.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error in findByDatePath:', error);
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'coach')
  create(@Body() createClassDto: CreateClassDto, @Request() req) {
    return this.classService.create(createClassDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Request() req) {
    // Validar se o usuário está autenticado
    if (!req.user || !req.user.id) {
      throw new HttpException('Usuário não autenticado', HttpStatus.UNAUTHORIZED);
    }
    return this.classService.findAll();
  }

  // Endpoint que aceita data diretamente no path (formato YYYY-MM-DD)
  @Get(':date(\\d{4}-\\d{2}-\\d{2})')
  @UseGuards(AuthGuard('jwt'))
  async findByDateDirect(@Param('date') date: string, @Request() req) {
    try {
      // Validar se o usuário está autenticado
      if (!req.user || !req.user.id) {
        throw new HttpException('Usuário não autenticado', HttpStatus.UNAUTHORIZED);
      }
      
      return await this.classService.findByDate(date, req.user.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error in findByDateDirect:', error);
      throw new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @Request() req) {
    // Validar se o ID é um número
    if (isNaN(+id)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    
    // Validar se o usuário está autenticado
    if (!req.user || !req.user.id) {
      throw new HttpException('Usuário não autenticado', HttpStatus.UNAUTHORIZED);
    }
    
    return this.classService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'coach')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto, @Request() req) {
    // Validar se o ID é um número
    if (isNaN(+id)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    
    return this.classService.update(+id, updateClassDto);
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  async cancelClass(@Param('id') id: string, @Request() req) {
    // Aqui pode-se adicionar lógica para permitir apenas admin/coach
    const updated = await this.classService.update(+id, { status: 'cancelled' });
    return { message: 'Aula cancelada com sucesso', updated };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'coach')
  remove(@Param('id') id: string, @Request() req) {
    // Validar se o ID é um número
    if (isNaN(+id)) {
      throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    }
    
    return this.classService.remove(+id);
  }
}
