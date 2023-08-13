"use client"
import React, { useMemo, useState } from 'react'
import Modal from './Modal'
import useRentModal from '../hooks/useRentModal'
import Heading from '../Heading'
import { categories } from '@/app/constants'
import CategoryInput from '../inputs/CategoryInput'
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from 'react-hook-form';
import CategorySelect from '../inputs/CategorySelect'
import dynamic from 'next/dynamic'
import Counter from '../inputs/Counter'

enum STETPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGE = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentModal = () => {
  const useRent = useRentModal();
  const [step, setStep] = useState(STETPS.CATEGORY);

  // Handle the user's items on book room
  const { 
    register, 
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null, // it's an object
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: '',
      price: 1,
      title: '',
      description: '',
    }
  });
  const category = watch('category');
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount")
  const bathroomCount = watch("bathroomCount")

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }
 // end of the section

  const onBack = () => {
    setStep(value => value - 1);
  }
  const onNext = () => {
    setStep(value => value + 1);
  }

  const actionLabel = useMemo(() => {
    if (step === STETPS.PRICE) {
       return "Create";
    }
    return "Next";
  }, [step])

  const secondaryActionLabel = useMemo(() => {
    if (step === STETPS.CATEGORY) {
      return undefined;
    }
    return "Back";
  }, [step]);

  // Load Map
  const Map = useMemo(() => dynamic(() => import("../Map"), {ssr: false}), 
  [ location ])

  // Define the bodyContent
  let bodyContent = (
     <div className="flex flex-col gap-8">
       <Heading
          title="Which of these best describe your place?"
          subtitle="Pick a category"
       />
       <div className="grid grid-cols-1 md:grid-cols-2 max-h-[50vh] gap-3 overflow-y-auto px-3">
          { categories.map((categoryItem) => (
              <div 
                 className="col-span-1"
                 key={categoryItem.label}
              >
                <CategoryInput
                  label={categoryItem.label}
                  onClick={(category) => setCustomValue('category', category)}
                  selected={category === categoryItem.label}
                  icon={categoryItem.icon}
                 />
              </div>
            ))
          }
       </div>
     </div>
  )

  if (step === STETPS.LOCATION) {
      bodyContent= (
        <div className="flex flex-col gap-8">
            <Heading
               title="Which is your place loacated?"
               subtitle="Help guest find you!"
            />
            <CategorySelect
               value={location}
               onChange={(value) => setCustomValue('location', value)} 
             />
             <Map center={location?.latlong}/>
        </div>
      );
  }

  if (step === STETPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
          <Heading
            title="Share some basics about your place."
            subtitle="What amenities do you have?"
          />
          <Counter 
               title="Guests"
               subtitle="How many guests do you allow?"
               onChange={(value) => setCustomValue("guestCount", value)}
               value={guestCount}
         />
         <hr/>
          <Counter 
               title="Rooms"
               subtitle="How many rooms do you have?"
               onChange={(value) => setCustomValue("roomCount", value)}
               value={roomCount}
         />

        <hr/>
          <Counter 
               title="Bathrooms"
               subtitle="How many bathrooms do you have?"
               onChange={(value) => setCustomValue("bathroomCount", value)}
               value={bathroomCount}
         />
      </div>
    )
  }

  return (
    <Modal
        title="Airbnb is your home!"
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        onClose={useRent.onClose}
        onSubmit={onNext}
        isOpen={useRent.isOpen}
        body={bodyContent}
        secondaryAction={step === STETPS.CATEGORY ? undefined: onBack}
   />
 )
}

export default RentModal