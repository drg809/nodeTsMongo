import { Route, Get, Controller, Post, BodyProp, Put, Delete, SuccessResponse } from 'tsoa';
import { matchNotesModel } from '../models/matchNotes';

@Route('/')
export class matchNotesController extends Controller {
    @Get('/match_notes/{entrieId}')
    public async getAll(@BodyProp('entrieId') entrieId: string) : Promise<any[]> {
        try {
            let items: any[] = await matchNotesModel.find({entrieId: entrieId, visible: true, deletedAt: { $eq: null }});
            items = items.map((item) => { return {
                id: item._id,
                userId: item.userId,
                entrieId: item.entrieId,
                text: item.text,
                visible: item.visible
              }
            });
            return items;
        } catch (err) {
            this.setStatus(500);
            console.error('Caught error', err);
        }
    }
    @Get('/match_notesh/{entrieId}/{userId}')
    public async getHiddenNotes(@BodyProp('entrieId') entrieId: string,@BodyProp('userId') userId: string) : Promise<any[]> {
      try {
          let items: any[] = await matchNotesModel.find({entrieId: entrieId, userId: userId, visible: false, deletedAt: { $eq: null }});
          items = items.map((item) => { return {
              id: item._id,
              userId: item.userId,
              entrieId: item.entrieId,
              text: item.text,
              visible: item.visible
            }
          });
          return items;
      } catch (err) {
          this.setStatus(500);
          console.error('Caught error', err);
      }
  }

    @Post('/match_notes')
    public async create(@BodyProp('userId') userId: string,
     @BodyProp('entrieId') entrieId: string,
     @BodyProp('text') text: string,
     @BodyProp('visible') visible: boolean): Promise<any> {
        const item = new matchNotesModel({
          userId: userId,
          entrieId: entrieId,
          text: text,
          visible: visible
        });
        await item.save();
        return item;
    }

    @Put('/match_notes/{id}')
    public async update(id: string,
      @BodyProp('userId') userId: string,
      @BodyProp('entrieId') entrieId: string,
      @BodyProp('text') text: string,
      @BodyProp('visible') visible: boolean): Promise<void> {
        await matchNotesModel.findOneAndUpdate({_id: id, deletedAt: { $eq: null }}, { $set: {
          userId: userId,
          entrieId: entrieId,
          text: text,
          visible: visible
        } } );
    }

    @Delete('/match_notes/{id}')
    public async remove(id: string): Promise<void> {
        await matchNotesModel.findOneAndUpdate({_id: id, deletedAt: { $eq: null }}, { $set: {
          deletedAt: new Date()
        } } );
    }
}
