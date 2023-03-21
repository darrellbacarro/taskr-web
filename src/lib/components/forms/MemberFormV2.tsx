"use client";

import { addMemberModalKey, editMemberModalKey } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import {
  Button,
  Flex,
  Grid,
  Text,
  TextInput,
  Image,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { AuthResponse, PostgrestSingleResponse } from "@supabase/supabase-js";
import { IconX, IconCheck } from "@tabler/icons-react";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { KeyedMutator } from "swr";
import { LordIcon } from "../LordIcon";
import { MemberFields } from "../modals/MemberModal";

interface MemberFormV2Props {
  id?: string;
  mutate?: KeyedMutator<any>;
}

export const MemberFormV2 = forwardRef<HTMLFormElement, MemberFormV2Props>(
  ({ id, mutate }, ref) => {
    const [filePhoto, setFilePhoto] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [fileKey, setFileKey] = useState<string | null>(null);
    const [dataLoading, setDataLoading] = useState(false);

    const form = useForm<MemberFields>({
      initialValues: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      validateInputOnChange: true,
      validate: {
        email: isEmail("Invalid email address"),
        password: !!id ? () => null : isNotEmpty("Please enter your password"),
        confirmPassword: (value, values) =>
          value !== values.password && !id ? "Passwords do not match" : null,
      },
    });

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

    const handleSave = useCallback(
      async (values: MemberFields) => {
        const { firstname, lastname, email, password, photo } = values;
        const mode = id ? "update" : "create";
        setProcessing(true);
        let shouldUpload = true;

        if (mode === "update" && !!photo && fileKey) {
          // get filename
          const filename = photo.name;

          if (fileKey !== filename) {
            // delete old photo
            await supabase.storage.from("avatars").remove([fileKey]);
          } else {
            shouldUpload = false;
          }
        }

        const extraData: Record<string, any> = {
          firstname,
          lastname,
        };

        if (photo && shouldUpload) {
          // save photo to supabase storage
          const { data: upload } = await supabase.storage
            .from("avatars")
            .upload(photo.name, photo);
          extraData.avatar_url = upload?.path;
        }
        // save member to supabase table
        let result: AuthResponse | PostgrestSingleResponse<any>;
        if (mode === "update") {
          result = await supabase
            .from("profiles")
            .update(extraData)
            .eq("id", id);
        } else {
          result = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: extraData,
            },
          });
        }

        const { data, error } = result;

        setProcessing(false);

        if (error) {
          notifications.show({
            title: `${mode === "create" ? "Create" : "Update"} Member Error`,
            message: error.message,
            icon: <IconX />,
            color: "red",
          });
          return;
        }

        modals.close(mode === 'update' ? editMemberModalKey : addMemberModalKey);

        notifications.show({
          title: `Member ${mode === "create" ? "Created" : "Updated"}`,
          message: `Member ${data?.user?.email ?? email} ${
            mode === "create" ? "created" : "updated"
          } successfully`,
          icon: <IconCheck />,
          color: "green",
        });

        if (mutate) mutate();
      },
      [id, fileKey, mutate]
    );

    useEffect(() => {
      if (id) {
        setDataLoading(true);
        supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single()
          .then(async ({ data, error }) => {
            if (error) {
              notifications.show({
                title: "Get Member Error",
                message: error.message,
                icon: <IconX />,
                color: "red",
              });
              return;
            }
            const { data: fileData } = await supabase.storage
              .from("avatars")
              .download(data.avatar_url);

            if (fileData) {
              const file = new File([fileData], data.avatar_url);
              data["photo"] = file;
              setFilePhoto(file);
            }

            form.setValues(data);
            setFileKey(data.avatar_url);
          })
          .then(() => setDataLoading(false));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
      <form
        style={{ position: "relative" }}
        ref={ref}
        onSubmit={form.onSubmit(handleSave)}
      >
        <LoadingOverlay visible={dataLoading} />
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
                disabled={!!id}
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Password"
                type={"password"}
                disabled={!!id}
                {...form.getInputProps("password")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Confirm Password"
                type={"password"}
                disabled={!!id}
                {...form.getInputProps("confirmPassword")}
              />
            </Grid.Col>
          </Grid>
          <Group position="right" mt="sm">
            <Button
              disabled={processing}
              onClick={() => modals.closeAll()}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit" loading={processing}>
              {id ? "Update " : "Save "}Member
            </Button>
          </Group>
        </Flex>
      </form>
    );
  }
);

MemberFormV2.displayName = "MemberForm";
