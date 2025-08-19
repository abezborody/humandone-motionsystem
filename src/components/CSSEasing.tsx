import { Copy } from "lucide-react";

import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "./ui/select";
import { DURATION_TOKEN } from "../lib/duration-tokens";
import type { Easing } from "../lib/css-easings";

interface Props {
  easing: Easing;
}

export const CSSEasing = ({ easing }: Props) => {
  return (
    <div className="flex flex-col gap-2 items-center p-2 border border-gray-200 rounded-md">
      <div className="w-full h-50 rounded bg-gray-200">preview</div>
      <div className="flex flex-col gap-1 items-start">
        <h3 className="font-medium">{easing.name}</h3>
        <div className="flex flex-col gap-2 text-mono">
          <Select defaultValue="duration-300">
            <SelectTrigger className="w-full rounded border-none shadow-none bg-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-gray-50 shadow-none border rounded bg-white">
              <SelectGroup>
                <SelectLabel>Duration token</SelectLabel>
                {Object.entries(DURATION_TOKEN).map(([token, value]) => (
                  <SelectItem key={token} value={token}>
                    {token} ({value}ms)
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <div className="flex items-center gap-2 px-2 text-sm text-mono rounded bg-gray-100">
              {easing.value}
            </div>
            <Button
              className="shadow-non cursor-pointer shadow-none"
              variant="secondary"
              size="smallIcon"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
