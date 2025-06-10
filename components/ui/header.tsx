import { Avatar, AvatarFallback, AvatarImage } from './avatar';

import { Upload } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion';
import RecordScreen from '../RecordScreen';

const Header = ({
  subHeader,
  title,
  userImage,
}: {
  subHeader: string;
  title: string;
  userImage?: string;
}) => {
  return (
    <div className="flex flex-col gap-4  w-full  ">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          {userImage && (
            <Avatar className="w-10 h-10">
              <AvatarImage src={userImage} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
          <div>
            <p className="text-sm text-muted-foreground">{subHeader}</p>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/upload">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Video
            </Button>
          </Link>
          <RecordScreen />
        </div>
      </div>
      <div className="flex gap-4 w-full justify-between">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Search</Label>
          <Input type="text" placeholder="Search for videos..." />
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Filter</AccordionTrigger>
            <AccordionContent>
              <span>Hey there</span>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Header;
