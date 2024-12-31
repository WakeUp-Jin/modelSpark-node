import { Controller, Get, JsonController, Post, Req } from "routing-controllers";

@JsonController()
export class VoiceController {

    @Post('/create-picture')
    async createPicture(@Req() req: any) {
        console.log(req.body)
        let text = req.body.text

        let result = '你好，世界'

        return {
            data: result
        }

    }

}