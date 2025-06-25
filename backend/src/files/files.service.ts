import { Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly staticRoot = path.resolve(process.cwd(), 'static');
  async saveFile(file: Express.Multer.File): Promise<string> {
    console.log('Saving file:', file.originalname);
    try {
      // Генерируем уникальное имя файла
      const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
      const fileDir = 'floors';
      // const filePath = path.resolve(__dirname, '..', 'static', 'floors');
      const fullDirPath = path.join(this.staticRoot, fileDir);
      
      // Создаем директорию, если ее нет
      if (!fs.existsSync(fullDirPath)) {
        fs.mkdirSync(fullDirPath, { recursive: true });
      }
      
      // Сохраняем файл
      fs.writeFileSync(path.join(fullDirPath, fileName), file.buffer);
      
      console.log('File saved to:', path.join(fullDirPath, fileName));
      return `${fileDir}/${fileName}`;
    } catch (e) {
      throw new Error(`Ошибка при сохранении файла: ${e.message}`);
    }
  }
  
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.resolve(this.staticRoot, filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (e) {
      throw new Error(`Ошибка при удалении файла: ${e.message}`);
    }
  }
}
