import { Controller, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/framework/auth/jwt-auth.guard";

@Controller('comment')
@UseGuards(JwtAuthGuard)
export class CommentController {

}