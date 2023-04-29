# Option Pricing App
This is a TypeScript-based option pricing app that utilizes the Black-76 model for pricing European-style options on futures contracts. The app provides functions to calculate present value and implied volatility of call and put options.

## Getting Started
To start using the Option Pricing App, you need to import the Pricer_Black76 class.

```
import { Pricer_Black76 } from "./utils/pricer_Black76";
```
## Create an instance of the Pricer_Black76 class
```
import { DateTime } from "luxon";

const maturityDate = DateTime.fromISO("2023-12-31");
const riskFreeRate = 0.03;
const strike = 100;

const pricer = new Pricer_Black76(maturityDate, riskFreeRate, strike);
```
## Calculate Present Value
To calculate the present value of call and put options, use the PV method.

```
const priceDate = DateTime.fromISO("2023-01-01");
const future = 105;
const volatility = 0.2;

const [call, put] = pricer.PV(priceDate, future, volatility);

```
## Calculate Implied Volatility
To calculate the implied volatility of call and put options, use the impliedVol method.

```
const optionPrice = 5;
const useCall = true;

const impliedVolatility = pricer.impliedVol(priceDate, future, optionPrice, useCall);
```
Dependencies
This app depends on the following packages:

luxon: For handling dates and times.
mathjs: For advanced mathematical functions.
brent: A custom implementation of Brent's method for root-finding.
Make sure to install these packages in your project.

## License
This project is licensed under the MIT License.