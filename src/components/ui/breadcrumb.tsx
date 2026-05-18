import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default function BreadcrumbDemo() {
  return (
    <Breadcrumb className="w-64">
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/blog/react">React</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>Form</BreadcrumbItem>
    </Breadcrumb>
  );
}