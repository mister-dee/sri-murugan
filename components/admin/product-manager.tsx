import { createProductAction, updateProductAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Product, ProductUnit } from "@/lib/types";

const unitOptions: ProductUnit[] = ["piece", "kg", "litre"];

export function ProductManager({ products }: { products: Product[] }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm action={createProductAction} submitLabel="Create product" />
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm
                action={updateProductAction}
                product={product}
                submitLabel="Update product"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProductForm({
  action,
  product,
  submitLabel
}: {
  action: (formData: FormData) => void | Promise<void>;
  product?: Product;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      {product ? <input type="hidden" name="product_id" value={product.id} /> : null}
      <div className="space-y-2">
        <Label>Name</Label>
        <Input name="name" defaultValue={product?.name ?? ""} required />
      </div>
      <div className="space-y-2">
        <Label>Tamil name</Label>
        <Input name="tamil_name" defaultValue={product?.tamil_name ?? ""} />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select name="category" defaultValue={product?.category ?? "coconut"}>
          <option value="coconut">Coconut</option>
          <option value="oil">Oil</option>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Base rate</Label>
        <Input
          name="price_rupees"
          type="number"
          min="0"
          step="0.01"
          defaultValue={product ? (product.price_in_paise / 100).toString() : ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Sort order</Label>
        <Input
          name="sort_order"
          type="number"
          defaultValue={product?.sort_order ?? 99}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Units</Label>
        <div className="grid grid-cols-3 gap-2 rounded-md border bg-background p-3">
          {unitOptions.map((unit) => (
            <label key={unit} className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                name="unit_options"
                value={unit}
                defaultChecked={product?.unit_options.includes(unit) ?? unit === "piece"}
              />
              {unit}
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Description</Label>
        <Textarea name="description" defaultValue={product?.description ?? ""} />
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold md:col-span-2">
        <input name="is_active" type="checkbox" defaultChecked={product?.is_active ?? true} />
        Active on ordering page
      </label>
      <Button type="submit" className="md:col-span-2">
        {submitLabel}
      </Button>
    </form>
  );
}
