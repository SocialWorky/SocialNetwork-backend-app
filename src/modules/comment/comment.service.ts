import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  async getCommentById(_id: string): Promise<Comment> {
    return this.commentRepository.findOneBy({ _id: _id });
  }

  async getAllComments(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  async updateComment(
    _id: string,
    commentData: Partial<Comment>,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { _id: _id },
    });
    if (!comment) {
      throw new Error('Comment not found');
    }
    Object.assign(comment, commentData);
    return this.commentRepository.save(comment);
  }

  async deleteComment(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
