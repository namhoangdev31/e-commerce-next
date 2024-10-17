import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Header, HeaderDocument } from '../schemas/header.schema';
import { NavItem, NavItemDocument } from '../schemas/navItem.schema';
import { HeaderDto } from '../../modules/header/dto/header.dto';
import { NavItemDto } from 'src/modules/header/dto/navItem.dto';
import { HeaderGetAll } from '../../interfaces/header';

@Injectable()
export class HeaderRepository {
  constructor(
    @InjectModel(Header.name)
    private headerModel: Model<HeaderDocument>,
    @InjectModel(NavItem.name)
    private navItemModel: Model<NavItemDocument>,
  ) {}

  public async create(data: HeaderDto): Promise<HeaderDocument> {
    // Create and save the header first
    const headerData = {
      ...data,
      navItems: [],
    };
    const createdHeader = new this.headerModel(headerData);
    const savedHeader = await createdHeader.save();

    // Create and save NavItems with the header ID
    const createdNavItems = await Promise.all(
      data.navItems.map(async (navItem) => {
        const navItemWithHeader = {
          ...navItem,
          headerId: savedHeader._id,
        };
        return this.navItemModel.create(navItemWithHeader);
      }),
    );

    // Get the IDs of the created NavItems
    const navItemIds = createdNavItems.map((navItem) => navItem._id);

    // Update the header with the NavItem IDs
    savedHeader.navItems = navItemIds;
    return savedHeader.save();
  }

  public async findAll(): Promise<HeaderGetAll> {
    const headers = await this.headerModel.find().exec();
    const navItems = await this.navItemModel.find().exec();

    const data = headers.map((header) => ({
      id: header._id.toString(),
      navItems: navItems
        .filter(
          (navItem) => navItem.headerId.toString() === header._id.toString(),
        )
        .map((navItem) => ({
          id: navItem._id.toString(),
          label: navItem.label,
          url: navItem.url,
          position: navItem.position,
        })),
      logo_url: header.logo_url,
    }));

    return { data };
  }

  /**
   * Add a new NavItem to an existing Header.
   *
   * @param dto NavItem data to add, including the Header id.
   * @returns The newly added NavItem.
   * @throws Error if the Header is not found.
   */
  public async addNavItems(dto: NavItemDto): Promise<NavItemDocument> {
    try {
      // Find the header by its ID
      const header = await this.headerModel.findById(dto.headerId).exec();
      if (!header) {
        throw new Error('Header not found');
      }
      // Create and save the new NavItem
      const newNavItem = new this.navItemModel(dto);
      const savedNavItem = await newNavItem.save();
      // Add the new NavItem's ID to the header's navItems array
      header.navItems.push(savedNavItem._id);
      await header.save();
      return savedNavItem;
    } catch (error) {
      // Re-throw the error to be handled by the caller
      throw error;
    }
  }
}
