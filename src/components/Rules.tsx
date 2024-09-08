"use client";
import { RULES } from "@/utils/constants";
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";

const Rules = () => {
  return (
    <div className="bg-slate-100 rounded-lg shadow p-3 grow max-w-[300px] flex flex-col gap-3 my-5">
      <Accordion className="border-none bg-slate-100" allowZeroExpanded>
        <AccordionItem>
          <AccordionItemHeading className="my-2">
            <AccordionItemButton className="flex justify-between">
              <p className="font-semibold">Rules</p>
              <p>⇳</p>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel className="border-t">
            <p className="font-semibold text-sm my-3">Use your keyboard:</p>
            <ul className="flex flex-col gap-3 text-sm">
              {RULES.map((rule) => (
                <li key={rule.key} className="text-xs">
                  <p className="font-semibold">
                    {rule.symbol} {rule.key} :
                  </p>
                  <p>{rule.description}</p>
                </li>
              ))}
            </ul>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Rules;
