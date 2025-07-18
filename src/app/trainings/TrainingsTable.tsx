'use client';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '~/components/ui/table';
import type { MyTraining } from '~/types';
import StatusSelect from './StatusSelect';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SeasonSelector } from '../_components/SeasonSelector';
import { useUser } from '@clerk/nextjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import TrainingForm from './TrainingForm';

export default function TrainingsTable({ trainings }: { trainings: MyTraining[] }) {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = useState('2025-2026');
  const [displayedTrainings, setDisplayedTrainings] = useState(
    trainings?.filter((training) => training.trainings.season === selectedSeason)
  );
  const allSeasons: string[] = Array.from(
    new Set(trainings.map((training) => training.trainings.season))
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser();

  const userRoles = user?.publicMetadata?.roles as string[] | undefined;
  const isAdmin = userRoles?.includes('admin');

  const handleSuccess = () => {
    setDialogOpen(false);
    router.refresh();
  };

  useEffect(() => {
    setDisplayedTrainings(
      trainings?.filter((training) => training.trainings.season === selectedSeason)
    );
  }, [selectedSeason, trainings]);

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <div className="flex gap-4">
          <h1 className="pb-4 text-xl font-semibold text-vilvBlue">Inschrijven op trainingen</h1>
          <SeasonSelector
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
            allSeasons={allSeasons}
          />
        </div>

        <div className="flex space-x-4">
          {/* <button onClick={handleExport} className="rounded-md bg-vilvBlue p-2 text-white">
            Export
          </button> */}
          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button className="rounded-md bg-vilvGreen p-2 text-white">
                  Training toevoegen
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-vilvBlue">Training toevoegen</DialogTitle>
                </DialogHeader>
                <TrainingForm onSuccess={handleSuccess} method="POST" />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-vilvBlue">Datum</TableHead>
            <TableHead className="text-vilvBlue">Uur</TableHead>
            <TableHead className="text-vilvBlue">Veld</TableHead>
            <TableHead className="text-vilvBlue">Aantal spelers</TableHead>
            <TableHead className="text-vilvBlue">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedTrainings?.map((training) => (
            <TableRow key={training.trainings.id}>
              <TableCell onClick={() => router.push(`/trainings/${training.trainings.id}`)}>
                {training.trainings.date.split('-').reverse().join('-')}
              </TableCell>
              <TableCell onClick={() => router.push(`/trainings/${training.trainings.id}`)}>
                {training.trainings.time.slice(0, 5)}
              </TableCell>
              <TableCell onClick={() => router.push(`/trainings/${training.trainings.id}`)}>
                {training.trainings.pitch}
              </TableCell>
              <TableCell onClick={() => router.push(`/trainings/${training.trainings.id}`)}>
                {training.players ?? 0}
              </TableCell>
              <TableCell>
                <StatusSelect status={training.status} game_id={training.trainings.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
