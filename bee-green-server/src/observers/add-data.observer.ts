import {
  /* inject, Application, CoreBindings, */
  lifeCycleObserver, // The decorator
  LifeCycleObserver, // The interface
} from '@loopback/core';
//import the repository decorator
import {repository} from '@loopback/repository';

//import from LB app
import {UserRepository} from '../repositories';
import {User} from '../models';
import {PurchaseRepository} from '../repositories';
import {Purchase} from '../models';
import {InventoryItemRepository} from '../repositories';
import {InventoryItem} from '../models';

import fs = require('fs');
const csv = require('csv-parser');

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('AddDataGroup')
export class AddDataObserver implements LifeCycleObserver {

  importCSV = () => {
    let inventoryArray: InventoryItem[] = [];
    fs.createReadStream('../Data/Food_Production.csv')
    .pipe(csv())
    .on('data', (row: any) => {
      const inventoryItem = new InventoryItem({
        name: row["Food product"],
        totalScore: parseFloat(row["Normalized"]),
        category: row["Type"],
        associatedStores: [
          "INSTACART"
        ],
        stats: {
          Farm:  parseFloat(row["Farm"]),
          Processing:  parseFloat(row["Processing"]),
          Transport:  parseFloat(row["Transport"]),
          Packaging:  parseFloat(row["Packaging"]),
          Retail:  parseFloat(row["Retail"]),
          Total_emissions:  parseFloat(row["Total_emissions"]),
        }
      });
      inventoryArray.push(inventoryItem);;
    })
    .on('end', () => {
      let uniqueTypes: string[] = [];
      uniqueTypes = inventoryArray.filter((x) =>
        !uniqueTypes.includes(x.category as string)).map(
          (row: InventoryItem) => (row.category as string));
      let finalNormalized: InventoryItem[] = [];
      for(let i = 0; i < uniqueTypes.length; i++){
        let typedArr = inventoryArray.filter((x) =>
          x.category === uniqueTypes[i]);
        let max = -99999999999999;
        let min = 9999999999999;
        for(let j = 0; j < typedArr.length; j++){
          if(typedArr[j].totalScore && (typedArr[j].totalScore as number < min)) {
            min = typedArr[j].totalScore as number;
          }          
          if(typedArr[j].totalScore && (typedArr[j].totalScore as number > max)) {
            max = typedArr[j].totalScore as number;
          }
        }        
        for(let j = 0; j < typedArr.length; j++){
          const typedObj:{[key:string]:any} = {...typedArr[j]};
          if(typedObj){
            if(min === max){
              continue;
            } else if(typedObj.totalScore) {
              //remember, lower is good.
              //pretty good items... rate them on the lower side
              if(max < 1){
                const equilibriumVal = ((typedObj.totalScore as number - min)/(max - min))*10;
                typedObj.totalScore = (equilibriumVal * 3) / 10; //give a good low score.. out of 3.
              } else if(max < 2){
                const equilibriumVal = ((typedObj.totalScore as number - min)/(max - min))*10;
                typedObj.totalScore = (equilibriumVal * 5) / 10; //give avg score.. around 5 max
              } else if(max < 3){
                const equilibriumVal = ((typedObj.totalScore as number - min)/(max - min))*10;
                typedObj.totalScore = (equilibriumVal * 6) / 10; //give avg score.. around 6 max
              } else {
                const equilibriumVal = ((typedObj.totalScore as number - min)/(max - min))*10;
                typedObj.totalScore = (equilibriumVal * 10) / 10; //leave out of 10
              }
            }
          }
          finalNormalized = [...finalNormalized, typedObj as InventoryItem];
        }
      }

      let purchaseArray = [{
        purchaseDate: '2020-04-14',
        buyerUsername: 'KimPeppermint',
        items: [ inventoryArray[0], inventoryArray[12], inventoryArray[16], inventoryArray[36], inventoryArray[40] ],
        score: 4,
        store: "INSTACART",
        totalCost: 34,
        buyerIp: 'xxx'
      },
      {
        purchaseDate: '2020-04-14',
        buyerUsername: 'KimPeppermint',
        items: [ inventoryArray[5], inventoryArray[7], inventoryArray[9], inventoryArray[11], inventoryArray[22], inventoryArray[29] ],
        score: 4,
        store: "INSTACART",
        totalCost: 34,
        buyerIp: 'xxx'
      }]
      purchaseArray.forEach(purchase => {
        this.purchaseRepo.create(new Purchase(purchase));
      });

      this.writeNext(0, inventoryArray);

      console.log('CSV file successfully processed');
    });
  };

  writeNext = (start: number, array: InventoryItem[]) =>
  {
      console.log("Writing iteration " + start);
      let i = start;
      for( i = start; i < array.length; i++){
        this.inventoryRepo.create(new InventoryItem(array[i]));
        if(i === array.length - 1){
          return;
        }
        if(i === start + 5){
          break;
        }
      }
      setTimeout(() => 
      {
        this.writeNext(i + 1, array);
      }, 2000);
  }

  /*
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {}
  */
  constructor(
    @repository('UserRepository') private userRepo: UserRepository,
    @repository('PurchaseRepository') private purchaseRepo: PurchaseRepository,
    @repository('InventoryItemRepository') private inventoryRepo: InventoryItemRepository,
  ) {}

  /**
   * This method will be invoked when the application initializes. It will be
   * called at most once for a given application instance.
   */
  async init(): Promise<void> {
    // Add your logic for init
  }

  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    // Add your logic for start
    //seed the repository
    let count: number = (await this.userRepo.count()).count;
    console.log(count);
    if (count !== 0) return;

    //create an instance of Requirement to be inserted into the database
    let userData = new User({
      creationDate: '2020-04-14',
      username: 'KimPeppermint',
      ip: 'xxx',
      purchaseIds: [],
      region: 'North America'
    });
    this.userRepo.create(userData);    

    this.importCSV();
  }

  /**
   * This method will be invoked when the application stops.
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
