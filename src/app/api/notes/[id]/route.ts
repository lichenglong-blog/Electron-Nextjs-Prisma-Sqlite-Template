import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// 获取单个笔记
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: '无效的笔记ID' },
        { status: 400 }
      );
    }
    
    const note = await prisma.note.findUnique({
      where: { id },
    });
    
    if (!note) {
      return NextResponse.json(
        { success: false, error: '笔记不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: note
    });
  } catch (error: any) {
    console.error(`获取笔记失败:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 删除笔记
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: '无效的笔记ID' },
        { status: 400 }
      );
    }
    
    await prisma.note.delete({
      where: { id },
    });
    
    return NextResponse.json({
      success: true
    });
  } catch (error: any) {
    console.error(`删除笔记失败:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 更新笔记
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: '无效的笔记ID' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // 验证请求数据
    if ((!data.title && !data.content)) {
      return NextResponse.json(
        { success: false, error: '更新内容不能为空' },
        { status: 400 }
      );
    }
    
    // 准备更新数据
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.content) updateData.content = data.content;
    
    // 更新笔记
    const note = await prisma.note.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json({
      success: true,
      data: note
    });
  } catch (error: any) {
    console.error(`更新笔记失败:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 