import { ActivityCard } from "@/src/shared/components/tourism";
import { PublicTourismPage } from "@/src/shared/components/publicTourismPage";
import { loadPublicCollection } from "@/src/server/tourismCollections";

export default async function ActivitiesPage() {
  const activities = await loadPublicCollection("activities", "lanka-trails");

  return (
    <PublicTourismPage
      eyebrow="Activities"
      title="Activities and experiences"
      description="Manage destination experiences, short tours, and add-ons in the same tourism platform."
    >
      {activities.map((activity) => (
        <ActivityCard
          key={`${activity.slug}-${activity.id}`}
          title={activity.title}
          subtitle={activity.subtitle}
          description={activity.description}
          meta={activity.amount ?? activity.status}
          image={activity.image}
          href={`/activities/${activity.slug}`}
          fields={activity.fields}
        />
      ))}
    </PublicTourismPage>
  );
}
