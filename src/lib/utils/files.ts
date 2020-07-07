import fs from 'fs';

type ReadFileOptions = {
  skip: number
}

export const readFileLines = (filePath: string, { skip }: ReadFileOptions) => {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n')
  // removing last line as it should always be a line break  
  lines.pop();

  return skip > 0 ? lines.slice(skip) : lines;
}
