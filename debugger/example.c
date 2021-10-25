#include <stdio.h>

size_t strlen(const char *s)
{
    const char *sc;

    for (sc = s; *sc != '\0'; ++sc)
        /* nothing */;
    return sc - s;
}

int main()
{
    char str[] = "Hello World";
    int length = strlen(str);
    printf("The length of str is %d !\n", length);

    return 0;
}