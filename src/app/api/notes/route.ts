import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 调试信息，帮助识别环境
console.log(`Notes API Route - 运行环境: ${process.env.NODE_ENV}`);
console.log(`数据库URL: ${process.env.DATABASE_URL || '未设置'}`);

// 获取所有笔记
export async function GET() {
  try {
    console.log('处理GET请求 - 获取所有笔记');
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log(`成功获取 ${notes.length} 条笔记记录`);
    return NextResponse.json({ 
      success: true, 
      data: notes 
    });
  } catch (error: any) {
    console.error(`获取笔记失败:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 创建笔记
export async function POST(request: NextRequest) {
  try {
    console.log('处理POST请求 - 创建笔记');
    const data = await request.json();
    
    // 验证请求数据
    if (!data.title || !data.content) {
      console.log('请求数据验证失败: 标题或内容为空');
      return NextResponse.json(
        { success: false, error: '标题和内容不能为空' },
        { status: 400 }
      );
    }
    
    // 创建笔记
    const note = await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
      },
    });
    
    console.log(`成功创建笔记, ID: ${note.id}`);
    return NextResponse.json({
      success: true,
      data: note
    }, { status: 201 });
  } catch (error: any) {
    console.error(`创建笔记失败:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 