import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Like, Repository, UpdateResult } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/user/entities/user.entity';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new BadRequestException('User not found!');
      }
      const post = await this.postRepository.save({ ...createPostDto, user });
      if (!post) {
        throw new BadRequestException('Create post failed!');
      }
      return post;
    } catch (error) {
      throw new BadRequestException('Create post failed!');
    }
  }

  async findAll(query: FilterPostDto): Promise<any> {
    const page = query.page ? Number(query.page) : 1;
    const items_per_page = query.items_per_page
      ? Number(query.items_per_page)
      : 10;
    const keyword = query.search ? query.search : '';
    const category = query.category ? Number(query.category) : null;
    const skip = (page - 1) * items_per_page;
    const [res, total] = await this.postRepository.findAndCount({
      where: [
        { title: Like('%' + keyword + '%'), category: { id: category } },
        { description: Like('%' + keyword + '%'), category: { id: category } },
      ],
      order: { created_at: 'DESC' },
      skip,
      take: items_per_page,
      relations: {
        user: true,
        category: true,
      },
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          avatar: true,
        },
        category: {
          id: true,
          name: true,
        },
      },
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: res,
      total,
      currentPage: page,
      lastPage,
      nextPage,
      prevPage,
    };
  }

  async findDetail(id: number) {
    return await this.postRepository.findOne({
      where: { id },
      relations: {
        user: true,
        category: true,
      },
      select: {
        user: {
          first_name: true,
          last_name: true,
          email: true,
          status: true,
          avatar: true,
        },
        category: {
          id: true,
          name: true,
        },
      },
    });
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return this.postRepository.update(id, updatePostDto);
  }

  async remove(id: number): Promise<any> {
    return this.postRepository.delete(id);
  }
}
