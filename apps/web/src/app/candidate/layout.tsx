import DashboardLayout from '@/components/DashboardLayout';

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout role="candidate">
      {children}
    </DashboardLayout>
  );
}
