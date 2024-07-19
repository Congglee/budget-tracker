"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { LogIn, UserPlus } from "lucide-react";

export default function AuthToggle() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-9 h-9 rounded-full">
          <Avatar className="w-9 h-9">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>BT</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <LoginLink className="space-x-2">
            <LogIn className="size-5" />
            <span>Sign In</span>
          </LoginLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <RegisterLink className="space-x-2">
            <UserPlus className="size-5" />
            <span>Sign up</span>
          </RegisterLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
