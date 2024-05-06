"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import React from "react";
import Container from "../container";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SearchInput from "../search";
import { ModeToggle } from "../theme-toggle";
import { NavMenu } from "./navMenu";

export default function NavBar() {
  const router = useRouter();
  const { userId } = useAuth();
  return (
    <div className="sticky top-0 border-b-primary/10 bg-secondary py-4">
      <Container>
      <div className="flex justify-between items-center">
      <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          <p className="text-black font-semibold">
            Renta<span className="text-green-400">hub</span>
          </p>
        </div>

        <SearchInput placeholder="Search"/>
        <div className="flex gap-3 items-center">
          <div className="flex gap-2">
          <ModeToggle/>

          <NavMenu/>
          </div>
          <UserButton />

          {!userId && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  router.push("/sign-in");
                }}
              >
                Sign in
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  router.push("/sign-up");
                }}
              >
                Sign up
              </Button>
            </>
          )}
        </div>

      </div>

      </Container>
    </div>
  );
}
