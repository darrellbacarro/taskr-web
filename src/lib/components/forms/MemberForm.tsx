"use client";

import { Button, Flex, Grid, Text, TextInput, Image } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { UseFormReturnType } from "@mantine/form";
import {
  FormEventHandler,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { LordIcon } from "../LordIcon";
import { MemberFields } from "../modals/MemberModal";

type MemberFormProps = {
  form: UseFormReturnType<MemberFields>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const MemberForm = forwardRef<HTMLFormElement, MemberFormProps>(
  ({ onSubmit, form }, ref) => {
    const [filePhoto, setFilePhoto] = useState<File | null>(null);

    const handleAccept = useCallback(
      (files: File[]) => {
        setFilePhoto(files[0]);
        form.setFieldValue("photo", files[0]);
      },
      [form]
    );

    const photo = useMemo(() => {
      if (!filePhoto) return null;
      return URL.createObjectURL(filePhoto);
    }, [filePhoto]);

    return (
      <form ref={ref} onSubmit={onSubmit}>
        <Flex gap="md" direction={"column"}>
          <Dropzone
            sx={{
              height: 125,
              width: 125,
              alignSelf: "center",
              padding: 0,
              overflow: "hidden",
            }}
            onDrop={handleAccept}
            multiple={false}
            accept={IMAGE_MIME_TYPE}
          >
            {photo ? (
              <Image
                src={photo}
                imageProps={{ onLoad: () => URL.revokeObjectURL(photo) }}
                alt="Profile Photo"
                width={122}
                height={122}
              />
            ) : (
              <Flex
                sx={{ height: 122, width: 122 }}
                direction="column"
                align="center"
                justify="center"
              >
                <LordIcon
                  src="/images/animated/8-account-outline-edited.json"
                  trigger="hover"
                  target=".mantine-Dropzone-root"
                  colors={{ primary: "#d0d0d0" }}
                  size={48}
                />
                <Text
                  fz={12}
                  pl="sm"
                  pr="sm"
                  pt="sm"
                  align="center"
                  fw={500}
                  color="gray"
                >
                  Upload Profile Photo
                </Text>
              </Flex>
            )}
          </Dropzone>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                autoFocus
                label="First Name"
                {...form.getInputProps("firstname")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Last Name"
                {...form.getInputProps("lastname")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Email Address"
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Password"
                type={"password"}
                {...form.getInputProps("password")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Confirm Password"
                type={"password"}
                {...form.getInputProps("confirmPassword")}
              />
            </Grid.Col>
          </Grid>
          <Button type="submit" sx={{ visibility: "hidden" }}>
            Submit
          </Button>
        </Flex>
      </form>
    );
  }
);

MemberForm.displayName = "MemberForm";
