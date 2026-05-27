import { Controller, All, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @All()
  forwardRoot(@Req() request: Request) {
    return this.forward(request);
  }

  @All('*')
  forwardAll(@Req() request: Request) {
    return this.forward(request);
  }

  private forward(request: Request) {
    const path = request.path.replace(/^\/api/, '');
    const userId = (request as any).user?.id || (request as any).user?.sub;
    if (userId) {
      (request as any).headers['x-user-id'] = String(userId);
    }
    return this.notificationService.forward(request, path);
  }
}
