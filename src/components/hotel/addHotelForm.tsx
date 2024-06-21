"use client";

import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import axios from 'axios'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useState } from "react";
import { UploadButton } from "../uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import Image from "next/image";
import { Loader2, PencilLine, XCircle } from "lucide-react";
import useLocation from "../../../hooks/useLocation";
import { ICity, IState } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface addHotelFormProps {
  hotel: HotelWithRooms | null;
}

export type HotelWithRooms = Hotel & {
  rooms: Room[];
};



const formSchema = z.object({
  title: z.string().min(3, {
    message: "title must be 3 characters long",
  }),
  description: z.string().min(10, {
    message: "description must be at least 10 characters long",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
  country: z.string().min(1, {
    message: "Country is required",
  }),
  state: z.string().optional(),
  city: z.string().optional(),
  locationDescription: z.string().min(10, {
    message: "description must be at least 10 characters long",
  }),
  gym: z.boolean().optional(),
  spa: z.boolean().optional(),
  bar: z.boolean().optional(),
  laundry: z.boolean().optional(),
  resturant: z.boolean().optional(),
  shopping: z.boolean().optional(),
  freeParking: z.boolean().optional(),
  bikeRental: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  movieNight: z.boolean().optional(),
  swimmingPool: z.boolean().optional(),
  coffeshop: z.boolean().optional(),
})


const AddHotelForm = ({ hotel }: addHotelFormProps) => {
  // const form = useForm<z.infer<typeof formSchema>>({
  //   mode: 'onChange',
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     title: "",
  //     description: "",
  //     // image: "",
  //     country: "",
  //     state: "",
  //     city: "",
  //     locationDescription: "",
  //     gym: false,
  //     spa: false,
  //     bar: false,
  //     laundry: false,
  //     resturant: false,
  //     shopping: false,
  //     freeParking: false,
  //     bikeRental: false,
  //     freeWifi: false,
  //     movieNight: false,
  //     swimmingPool: false,
  //     coffeshop: false,
  //   },
  // });

 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
     defaultValues: {
      title: "",
      description: "",
      image: "",
      country: "",
      state: "",
      city: "",
      locationDescription: "",
      gym: false,
      spa: false,
      bar: false,
      laundry: false,
      resturant: false,
      shopping: false,
      freeParking: false,
      bikeRental: false,
      freeWifi: false,
      movieNight: false,
      swimmingPool: false,
      coffeshop: false,
    },
  })


  
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState<boolean | undefined>(
    false
  );

  const { toast } = useToast();
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { getAllCountries, getCountryStates, getStateCities } = useLocation();

  const router  = useRouter()
 
  async function handleImageDelete(image: string): Promise<void> {
    setImageIsDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    await axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        console.log(res, "res logged");
        if (res.status === 200) {
          setImage("");
          toast({
            variant: "success",
            description: "Image removed",
          });
        }
      })
      .catch((e) => {
        toast({
          variant: "destructive",
          description: "something went wrong",
        });
      })
      .finally(() => {
        setImageIsDeleting(false);
      });
  }



  useEffect(() => {
    const selectedCountry = form.watch("country");
    const countryState = getCountryStates(selectedCountry);
    if (countryState) {
      setStates(countryState);
    }
  }, [form.watch("country")]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const selectedState = form.watch("state");
    const stateCites = getStateCities(selectedCountry, selectedState);

    if (stateCites) {
      setCities(stateCites);
    }
  }, [form.watch("country"), form.watch("state")]);



  useEffect(()=>{
    if (typeof image ==='string') {
     form.setValue('image',image, {
       shouldValidate:true,
       shouldDirty:true,
       shouldTouch:true
     })
    }
  },[image])

  const countries = getAllCountries();
 


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("logged to console")
    setIsLoading(true)
    if (hotel) {
      
    }else{
      axios.post('/api/hotel', values).then((res:any)=>{
        toast({
          variant:"success",
          description:"Hotel creation"
        }) 

        router.push(`/hotel/${res.data.id}`)
        setIsLoading(false)
      })
    }

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <div>
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h3 className="text-lg font-semibold">
            {" "}
            {hotel ? "update your hotel!" : "Create your hotel"}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6 ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Title</FormLabel>
                    <FormDescription>provide your hotel name</FormDescription>
                    <FormControl>
                      <Input placeholder="Beach hotel" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Description</FormLabel>
                    <FormDescription>
                      provide a detailed description of your hotel name
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Beach hotel is parked with many amenties"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Hotel Description</FormLabel>
                <FormDescription>Choose Amenities</FormDescription>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="gym"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                          />
                        </FormControl>
                        <FormLabel> Gym</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                          />
                        </FormControl>
                        <FormLabel> Spa</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bar"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                          />
                        </FormControl>
                        <FormLabel> Bar</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="laundry"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                          />
                        </FormControl>
                        <FormLabel> Laundry Facilities</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="resturant"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                          />
                        </FormControl>
                        <FormLabel> Resturant</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="freeParking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                          />
                        </FormControl>
                        <FormLabel> Free Parking</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bikeRental"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                          />
                        </FormControl>
                        <FormLabel> Bike Rental</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coffeshop"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                          />
                        </FormControl>
                        <FormLabel> coffeshop</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="movieNight"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                          />
                        </FormControl>
                        <FormLabel> Movie Nights</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-3">
                    <FormLabel>Upload an Image *</FormLabel>
                    <FormDescription>
                      provide a detailed description of your hotel name
                    </FormDescription>
                    <FormControl>
                      <>
                        {image ? (
                          <>
                            <div className="relative max-w-[200px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                              <Image
                                fill
                                src={image}
                                alt="Hotel pic"
                                className="object-contain"
                              />
                              <Button
                                onClick={() => handleImageDelete(image)}
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="absolute right-[-12px] top-0"
                              >
                                {imageIsDeleting ? <Loader2 /> : <XCircle />}
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div
                            className="flex flex-col items-center max-w[400px]
                           p-12 border-2 border-dashed border-primary/50 rounded mt-4"
                          >
                            <UploadButton
                              endpoint="imageUploader"
                              onClientUploadComplete={(res: any) => {
                                // Do something with the response
                                console.log("Files: ", res);
                                setImage(res[0].url);
                                toast({
                                  variant: "success",
                                  description: "Upload successful",
                                });
                              }}
                              onUploadError={(error: any) => {
                                // Do something with the error.
                                toast({
                                  variant: "destructive",
                                  description: `Error! ${error?.message}`,
                                });
                              }}
                            />
                          </div>
                        )}
                      </>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1 flex flex-col gap-6 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Select Country *</FormLabel>
                      <FormDescription>
                        In which counntry is your form located
                      </FormDescription>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a country"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country: any, id: number) => {
                            return (
                              <SelectItem
                                key={country.isoCode}
                                value={country.isoCode}
                              >
                                {country.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Select State *</FormLabel>
                      <FormDescription>
                        In which state is your property located
                      </FormDescription>
                      <Select
                        disabled={isLoading || !states.length}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a State"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state: any, id: number) => {
                            return (
                              <SelectItem
                                key={state.isoCode}
                                value={state.isoCode}
                              >
                                {state.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Select City </FormLabel>
                    <FormDescription>
                      In which city/town is your property located
                    </FormDescription>
                    <Select
                      disabled={isLoading || cities.length < 1}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a City"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city: any, id: number) => {
                          return (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Description</FormLabel>
                    <FormDescription>
                      provide a location description of your hotel
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="located at the very end of the beach "
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between gap-2 flex-wrap">
                {hotel ? (
                  <>
                    <Button className="max-w-[150px]" disabled={isLoading} type="submit">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4" /> Updating
                        </>
                      ) : (
                        <>
                          <PencilLine className="mr-2 h-4 w-4" /> Update
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button className="max-w-[150px]" disabled={isLoading} type="submit">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" /> Creating
                      </>
                    ) : (
                      <>
                        <PencilLine className="mr-2 h-4 w-4" /> Create Hotel
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form> */}


      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h3 className="text-lg font-semibold">
          {" "}
          {hotel ? "update your hotel!" : "Create your hotel"}
        </h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6 ">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Title</FormLabel>
                  <FormDescription>provide your hotel name</FormDescription>
                  <FormControl>
                    <Input placeholder="Beach hotel" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Description</FormLabel>
                  <FormDescription>
                    provide a detailed description of your hotel name
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Beach hotel is parked with many amenties"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Hotel Description</FormLabel>
              <FormDescription>Choose Amenities</FormDescription>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="gym"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <FormLabel> Gym</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spa"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <FormLabel> Spa</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bar"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <FormLabel> Bar</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="laundry"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <FormLabel> Laundry Facilities</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="resturant"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <FormLabel> Resturant</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="freeParking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <FormLabel> Free Parking</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bikeRental"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <FormLabel> Bike Rental</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coffeshop"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <FormLabel> coffeshop</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="movieNight"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 rounded-md border-2  p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <FormLabel> Movie Nights</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-3">
                  <FormLabel>Upload an Image *</FormLabel>
                  <FormDescription>
                    provide a detailed description of your hotel name
                  </FormDescription>
                  <FormControl>
                    <>
                      {image ? (
                        <>
                          <div className="relative max-w-[200px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                            <Image
                              fill
                              src={image}
                              alt="Hotel pic"
                              className="object-contain"
                            />
                            <Button
                              onClick={() => handleImageDelete(image)}
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-[-12px] top-0"
                            >
                              {imageIsDeleting ? <Loader2 /> : <XCircle />}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div
                          className="flex flex-col items-center max-w[400px]
                         p-12 border-2 border-dashed border-primary/50 rounded mt-4"
                        >
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res: any) => {
                              // Do something with the response
                              console.log("Files: ", res);
                              setImage(res[0].url);
                              toast({
                                variant: "success",
                                description: "Upload successful",
                              });
                            }}
                            onUploadError={(error: any) => {
                              // Do something with the error.
                              toast({
                                variant: "destructive",
                                description: `Error! ${error?.message}`,
                              });
                            }}
                          />
                        </div>
                      )}
                    </>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 flex flex-col gap-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Select Country *</FormLabel>
                    <FormDescription>
                      In which counntry is your form located
                    </FormDescription>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a country"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country: any, id: number) => {
                          return (
                            <SelectItem
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Select State *</FormLabel>
                    <FormDescription>
                      In which state is your property located
                    </FormDescription>
                    <Select
                      disabled={isLoading || !states.length}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a State"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state: any, id: number) => {
                          return (
                            <SelectItem
                              key={state.isoCode}
                              value={state.isoCode}
                            >
                              {state.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Select City </FormLabel>
                  <FormDescription>
                    In which city/town is your property located
                  </FormDescription>
                  <Select
                    disabled={isLoading || cities.length < 1}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a City"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city: any, id: number) => {
                        return (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Description</FormLabel>
                  <FormDescription>
                    provide a location description of your hotel
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="located at the very end of the beach "
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-2 flex-wrap">
              {hotel ? (
                <>
                  <Button className="max-w-[150px]" disabled={isLoading} type="submit">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" /> Updating
                      </>
                    ) : (
                      <>
                        <PencilLine className="mr-2 h-4 w-4" /> Update
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button className="max-w-[150px]" disabled={isLoading} type="submit">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4" /> Creating
                    </>
                  ) : (
                    <>
                      <PencilLine className="mr-2 h-4 w-4" /> Create Hotel
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>

    </div>
  );
};

export default AddHotelForm;
