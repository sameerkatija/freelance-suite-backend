import { Request, Response } from "express";
import Country from "../models/country";
import City from "../models/city";

// Interface for pagination query parameters
interface PaginateQuery {
  page?: number;
  limit?: number;
}

export const getCountries = async (req: Request, res: Response) => {
  const countries = await Country.find({});
  return res.status(200).json({ countries });
};

export const getCities = async (req: Request, res: Response) => {
  const cities = await City.find({ country: req.body.country });
  return res.status(200).json({ cities });
};
