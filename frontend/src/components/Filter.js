import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const Filter = ({
  minPrice,
  maxPrice,
  selectedCategory,
  setMinPrice,
  setMaxPrice,
  setSelectedCategory,
  categories,
}) => {
  return (
    <div className="bg-background h-full lg:h-auto p-2 lg:mt-2.5 lg:mb-2.5 lg:ml-2 space-y-4 lg:border border-border shadow-md lg:rounded-lg fixed top-15 z-9 lg:static">
      <div className="w-full flex items-center gap-4">
        <Label className="whitespace-nowrap">Price Range:</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            className="w-20"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <p>-</p>
          <Input
            type="number"
            className="w-20"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="w-full space-y-4">
        <Label>Categories:</Label>

        <RadioGroup
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="all" />
            <Label htmlFor="all" className="cursor-pointer">
              All
            </Label>
          </div>
          {categories &&
            categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.name} id={category._id} />
                <Label htmlFor={category._id} className="cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default Filter;
