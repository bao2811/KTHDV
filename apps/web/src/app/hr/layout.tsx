import DashboardLayout from '@/components/DashboardLayout';

export default function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="hr">
      {children}
    </DashboardLayout>
  );
}
