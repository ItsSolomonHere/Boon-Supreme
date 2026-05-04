import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export function OrderTrackWidget({ className = "" }) {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    const trimmed = id.trim();
    if (!trimmed) return;
    navigate(`/track/${trimmed}`);
  }

  return (
    <form
      onSubmit={submit}
      className={`flex flex-col gap-2 sm:flex-row sm:items-center ${className}`}
    >
      <label htmlFor="track-order-id" className="sr-only">
        Order ID
      </label>
      <Input
        id="track-order-id"
        placeholder="Track order — enter order ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="sm:max-w-xs"
      />
      <Button type="submit" variant="gold" className="gap-2 sm:w-auto">
        <Search className="h-4 w-4" />
        Track
      </Button>
    </form>
  );
}
