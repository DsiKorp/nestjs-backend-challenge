import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        console.log('DatabaseModule factory function called');
        console.log('AppDataSource.isInitialized:', AppDataSource.isInitialized);

        // If AppDataSource is not initialized, initialize it
        if (!AppDataSource.isInitialized) {
          console.log('Initializing AppDataSource...');
          await AppDataSource.initialize();
          console.log('AppDataSource initialized');
        } else {
          console.log('AppDataSource already initialized');
        }

        // Return the options from AppDataSource
        const options = {
          ...AppDataSource.options,
          autoLoadEntities: true,
        };
        //console.log('Returning options:', JSON.stringify(options, null, 2));
        return options;
      },
    }),
  ],
})
export class DatabaseModule {}
