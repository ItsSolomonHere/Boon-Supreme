import { LazyLoadImage } from "./LazyImage";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Flame, Leaf, Star } from "lucide-react";

export function MenuItemCard({ item, onAdd }) {
  return (
    <Card className="overflow-hidden border-brand-green/10 transition-shadow hover:shadow-warm">
      <div className="aspect-[4/3] overflow-hidden bg-brand-green/5">
        <LazyLoadImage
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {item.popular ? (
            <Badge variant="gold" className="gap-1">
              <Star className="h-3 w-3" aria-hidden />
              Popular
            </Badge>
          ) : null}
          {item.vegan ? (
            <Badge variant="default" className="gap-1">
              <Leaf className="h-3 w-3" aria-hidden />
              Vegan
            </Badge>
          ) : null}
          {item.spicy ? (
            <Badge variant="outline" className="gap-1">
              <Flame className="h-3 w-3" aria-hidden />
              Spicy
            </Badge>
          ) : null}
        </div>
        <h3 className="font-display text-lg font-semibold text-brand-green-deep">
          {item.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-brand-green-deep/70">
          {item.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="font-semibold text-brand-terracotta">
            KES {item.priceKES.toLocaleString()}
          </span>
          <Button variant="gold" size="sm" onClick={() => onAdd?.(item)}>
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
