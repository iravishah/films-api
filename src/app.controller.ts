import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./framework/auth/auth.service";
import { LocalAuthGuard } from "./framework/auth/local-auth.gaurd";

@Controller()
export class AppController {
  constructor(private authService: AuthService) { }
  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}