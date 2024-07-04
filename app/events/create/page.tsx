"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AtSign,
  Clock,
  LockKeyholeIcon,
  MapPin,
  PenLine,
  User,
} from "lucide-react";
import Header from "@/components/header";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import api from "@/app/_api/api";
import { useSession } from "next-auth/react";
import axios from "axios";

const formSchema = z.object({
  eventname: z.string().min(2, {
    message: "O nome da página deve ter pelo menos 2 caracteres",
  }),
  local: z.string().min(2, {
    message: "Digite um local válido",
  }),
  date: z.date({ message: "Por favor, insira uma data" }).optional(),
  hour: z.string().min(4, {
    message: "Digite um horário válido",
  }),
  description: z.string().min(10, {
    message: "A descrição da página deve ter pelo menos 10 caracteres",
  }),
});

const EventCreatePage = () => {
  const { data } = useSession();
  const [date, setDate] = React.useState<Date>();
  const [message, setMessage] = React.useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventname: "",
      local: "",
      hour: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    try {
      const response = await api.post("/events", {
        location: values.local,
        title: values.eventname,
        description: values.description,
        organizerId: "b0745f32-0bbb-4674-ba6e-8b0e1d5f9294",
        date: new Date(values.date), // Certifique-se de que o valor de 'date' é uma string que pode ser convertida para um Date
      });
      setMessage("Evento criado com sucesso!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          "Erro ao criar o evento: " +
          (error.response?.data?.message || error.message)
        );
      } else {
        setMessage("Erro desconhecido ao criar o evento");
      }
    }
  }
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-[90vh]">
        <h1 className="uppercase font-bold text-xl pb-12">Monte seu evento</h1>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="eventname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Nome do evento</FormLabel>
                    <div className="flex flex-row gap-2">
                      <PenLine className="mt-2" />
                      <FormControl>
                        <Input
                          className="min-w-72"
                          placeholder="Escreva o nome do evento"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="local"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Local</FormLabel>
                    <div className="flex flex-row gap-2">
                      <MapPin className="mt-2" />
                      <FormControl>
                        <Input
                          className="min-w-72"
                          placeholder="Insira um local para seu evento"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-4 max-w-[90vw]">
                <div className="max-w-[45vw]">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Data</FormLabel>
                        <div className="flex flex-row gap-2">
                          <CalendarIcon className="mt-2" />
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                  )}
                                >
                                  {date ? (
                                    format(date, "PPP")
                                  ) : (
                                    <span>Escolha uma data</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={setDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="max-w-[45vw]">
                  <FormField
                    control={form.control}
                    name="hour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Hora</FormLabel>
                        <div className="flex flex-row gap-2">
                          <Clock className="mt-2" />
                          <FormControl>
                            <Input placeholder="16:20" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="pb-7">
                <p className="text-sm underline">
                  Escolha uma imagem para seu evento
                </p>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Descrição</FormLabel>
                    <div className="flex flex-row gap-2">
                      <FormControl>
                        <Textarea
                          placeholder="Faça uma descrição sobre seu evento"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center items-center">
                <Button
                  className="min-w-[18.75rem] rounded-3xl font-bold text-xl uppercase"
                  type="submit"
                >
                  Avançar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default EventCreatePage;
